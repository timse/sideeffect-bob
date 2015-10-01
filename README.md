# Sideeffect Bob

loading scripts with sideeffects (writing globals etc pp that others depend on) in order while being async

# The tree to be loaded
The script exposes a function that takes a single argument which must be the dependency tree of the scripts to load.
The tree has to be an `Array` that may contain `Objects` or `Strings`.
The `Strings` must be URLs to a script that needs to be loaded
The `Objects` must have keys that are URLs of scripts that need to be loaded, the value of those objects must be a DependencyTree

Example:
```
    var depTree = [
        {
            'a.js': [
                'b.js',
                'c.js'
            ]
            'd.js': [
                {
                    'e.js' : ['f.js']
                }
            ]
        },
        'g.js'
    ];

    require('sideeffect-bob')(depTree);
```
The script above would load the scripts in the follwing order:

 1. `a.js`, `d.js`, and `g.js` are loaded in parallel in undefined order
 2. once `a.js` is loaded `b.js` and `c.js` get loaded in undefined order and in parallel
 3. once `d.js` is loaded `e.js` is loaded
 4. once `e.js` is loaded `f.js` is loaded

Equivalent with more obvious subDepTrees (this is the same as the script above)
```
    var aTree = ['b.js', 'c.js'];
    var eTree = ['f.js'];
    var dTree = [{'e.js': eTree}];
    var depTree = [
        {
            'a.js': aTree,
            'd.js': dTree
        },
        'g.js'
    ];

    require('sideeffect-bob')(depTree);
```
