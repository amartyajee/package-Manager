/**
 * Package Class
 * given the rules between packages, and with coherent rules, 
 * adds the package to a collection of selected pacakges, or removes it if already there
 * Toggle(p): a method for a collection of selected packages, to set or unset package p.
 * StringSlice(): returns a slice of string with the current list of selected packages.
 */

class Packages {
    constructor(ruleSet, set) {
        this.ruleSet = ruleSet;
        this.set = new Set();
    }

    // if dependency is present, remove the dependencies, else include it in the set
    toggle(dependency) {
        if (Object.keys(this.set).includes(dependency)) {
            this.removeDependency(dependency);
        } else {
            this.addDependency(dependency);
        }

        return this.set;
    }

    // return a slice of string with current list of selected package
    stringSlice() {
        return `[${[...this.set].join(' ')}]`;
    }

    // remove a dependency
    removeDependency(dependencyToBeRemoved, dependencies) {
        const depsToRemove = dependencies || new Set([dependencyToBeRemoved]);

        depsToRemove.forEach((toBeRemoved) => {
            delete this.set[toBeRemoved]
        });
    }

    // add a dependency
    addDependency(newDependency) {
        const dependencyToAdd = this.ruleSet.dependencies.get(newDependency);
        const currentDependency = Object.keys(this.set);

        [newDependency, ...dependencyToAdd].forEach((dep) => {
            if (!currentDependency.includes(dep) || !this.set[dep]) {
                this.set[dep] = true;

                const conflictiveDependencies = this.ruleSet.conflicts(dep);
                conflictiveDependencies.forEach((conflictiveDependency) => {
                    this.removeDependency(conflictiveDependency);
                })
            }
        });
    }
}

const toggle = (set, package, ruleSet) => {
    const packages = new Packages(ruleSet, set);

    return packages.toggle(package);
}

module.exports = {
    toggle
}