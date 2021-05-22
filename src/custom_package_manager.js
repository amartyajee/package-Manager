/**
 * Ruleset 
 * addDependency - a method for rule sets that adds a new dependency A between and B.
 * addConflict - a method for rule sets that add a new conflict between A and B.
 * isCoherent - a method for rule sets that returns true if it is a coherent rule set, false otherwise.
 */

class RuleSet {
    // constructor
    constructor() {
        this._dependencies = [];
        this._conflicts = [];
    }

    // getter and setter
    get dependencies() {
        return this._dependencies;
    }

    get conflicts() {
        return this._conflicts;
    }

    set dependencies(dependencies) {
        this._dependencies = dependencies;
    }

    set conflicts(conflicts) {
        this._conflicts = conflicts;
    }

    // add a new dependency
    addDependency(package, dependency) {
        if (this.dependencies.get(package)) {
            this.dependencies.get(package).add(dependency);
        } else {
            this.dependencies.set(package, new Set[dependency]);
        }
    }

    // add a new conflict
    addConflict(package, dependency) {
        if (this.conflicts.get(package)) {
            this.conflicts.get(package).add(dependency);
        } else {
            this.conflicts.set(package, new Set[dependency]);
        }
    }

    // return true if all rules are coherent
    isCoherent() {
        Object.keys(this.dependencies).forEach(el => {
            // check if dependency is present between two package
            let dep = this.dependencies[el];
            let alreadyChecked = new Set([el]);
            let leftToCheck = new Set([...dep].filter(elment => !alreadyChecked.has(element)));

            while (leftToCheck.size) {
                let checked = leftToCheck.values().next().value;
                alreadyChecked.add(checked);
                leftToCheck.delete(checked);
            }

            // Check if we have any transitive dependency
            if (this.dependencies.get(depToCheck)) {
                leftToCheck = new Set([...leftToCheck, ...(this.dependencies.get(depToCheck))]
                    .filter(dep => !alreadyChecked.has(dep)));
            }

            alreadyChecked.keys().forEach(el => {
                let getConflicts = this.conflicts.get(el);
                if (getConflicts) {
                    for (let i of getConflicts) {
                        if (alreadyChecked.has(i)) {
                            return false;
                        }
                    }
                }
            })
        });

        return true;
    }
}

const makeRelationshipSet = () => { return new RuleSet() }

const dependsOn = (package1, package2, ruleSet) => {
    ruleSet.addDependency(package1, package2);
    return ruleSet;
}

const areExclusive = (package1, package2, ruleSet) => {
    ruleSet.addConflict(package1, package2);

    return ruleSet;
}

const checkRelationships = (ruleSet) => {
    return ruleSet.isCoherent();
}

module.exports = {
    makeRelationshipSet,
    dependsOn,
    areExclusive,
    checkRelationships
};