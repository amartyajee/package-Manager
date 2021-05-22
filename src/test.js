const RuleSet = require('./custom_package_manager');
const Pkg = require('./package');

var s, selected;

s = RuleSet.makeRelationshipSet();
s = RuleSet.dependsOn('a', 'a', s);
console.assert(checkRelationships(s));

s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.dependsOn('b', 'a', s);
console.assert(checkRelationships(s));

s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.areExclusive('a', 'b', s);
console.assert(!checkRelationships(s));

s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.dependsOn('b', 'c', s);
s = areExclusive('a', 'c', s);
console.assert(!checkRelationships(s));

s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.dependsOn('b', 'c', s);
s = Ruleset.dependsOn('c', 'a', s);
s = Ruleset.dependsOn('d', 'e', s);
s = Ruleset.areExclusive('c', 'e', s);
console.assert(checkRelationships(s));

// This function takes some arguments and returns a set of selected options.
// If needed, you should replace it with your own data structure.
function set() {
    var l = {};
    for (var i in arguments) {
        l[arguments[i]] = true;
    }
    return l;
}

// This function returns whether two sets of selected options have the same options selected.
// If needed, you should reimplement it for your own data structure.
function setsEqual(a, b) {
    var ka = Object.keys(a).sort();
    var kb = Object.keys(b).sort();
    if (ka.length != kb.length) {
        return false;
    }
    for (var i in ka) {
        if (kb[i] != ka[i]) {
            return false;
        }
    }
    return true;
}

selected = set();  // Or list, array, etc.

selected = Pkg.toggle(selected, 'a', s);
console.assert(setsEqual(selected, set('a', 'c', 'b')));

s = Ruleset.dependsOn('f', 'f', s);
selected = Pkg.toggle(selected, 'f', s);
console.assert(setsEqual(selected, set('a', 'c', 'b', 'f')));

selected = Pkg.toggle(selected, 'e', s);
console.assert(setsEqual(selected, set('e', 'f')));

selected = Pkg.toggle(selected, 'b', s);
console.assert(setsEqual(selected, set('a', 'c', 'b', 'f')));

s = Ruleset.dependsOn('b', 'g', s);
selected = Pkg.toggle(selected, 'g', s);
selected = Pkg.toggle(selected, 'b', s);
console.assert(setsEqual(selected, set('g', 'f')));

s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.dependsOn('b', 'c', s);
selected = set();
selected = Pkg.toggle(selected, 'c', s);
console.assert(setsEqual(selected, set('c')));

// Deep dependencies
s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.dependsOn('b', 'c', s);
s = Ruleset.dependsOn('c', 'd', s);
s = Ruleset.dependsOn('d', 'e', s);
s = Ruleset.dependsOn('a', 'f', s);
s = Ruleset.areExclusive('e', 'f', s);
console.assert(!checkRelationships(s));

// Multiple dependencies and exclusions.

s = Ruleset.makeRelationshipSet();
s = Ruleset.dependsOn('a', 'b', s);
s = Ruleset.dependsOn('a', 'c', s);
s = Ruleset.areExclusive('b', 'd', s);
s = Ruleset.areExclusive('b', 'e', s);
console.assert(checkRelationships(s));
selected = set();
selected = Pkg.toggle(selected, 'd', s);
selected = Pkg.toggle(selected, 'e', s);
selected = Pkg.toggle(selected, 'a', s);
console.assert(setsEqual(selected, set('a', 'c', 'b')));