function noop(){};

function loadScript(url, callback){
    callback = callback || noop;
    var once = function(){
        callback();
        once = noop;
    }

    var script = document.createElement('script');
    script.async = 'true';
    var anchor = document.getElementsByTagName('script')[0];

    script.onreadystatechange = function(){
        if (script.readyState !== "loaded" || script.readyState !== "complete") {
            return;
        }
        once();
    }
    script.onload = once;
    anchor.parentNode.insertBefore(script, anchor);
};

/*
 * depTree must be an array that contains strings or objects
 * those objects must contain a depTree. e.g.:
 *  var depTree = [
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

    would load in the following order:
    'a.js', 'd.js', 'g.js'

    once 'a.js' is loaded 'b.js' and 'c.js' get loaded
    once 'd.js' is finished 'e.js' is loaded
    once 'e.js' is finished 'f.js' is loaded
 */
function loadDependencyTree(depTree){
    depTree.forEach(function itemIter(item){
        // just a string so we load
        if (typeof item === 'string') {
            return loadScript(item);
        }
        // another depTree
        Object.keys(item).forEach(function objIter(url){
            loadScript(url, function loadCallback(){
                loadDependencyTree(item[url]);
            });
        });
    });
};

module.exports = loadDependencyTree;
