export const GoalTypes = Object.freeze({
    STEPS: 0,
    WEIGHT_LOSS: 1,
    MILES: 2
});

export function stringifyGoalType(goalType) {
    var result;
    switch (goalType) {
        case GoalTypes.STEPS: { result = "walking goal"; break; }
        case GoalTypes.WEIGHT_LOSS: { result = "weight loss goal"; break; }
        case GoalTypes.MILES: { result = "walking goal"; break; }
        default: { result = "error"; break; }
    }
    return result;
}

export function stringifyGoalValue(goalValue, goalType) {
    var result = goalValue + " ";
    switch (goalType) {
        case GoalTypes.STEPS: { result += "steps"; break; }
        case GoalTypes.WEIGHT_LOSS: { result += "pounds"; break; }
        case GoalTypes.MILES: { result += "miles"; break; }
        default: { result += "errors"; break; }
    }
    return result;
}

export function getUnitsForGoalType(goalType) {
    switch (goalType) {
        case GoalTypes.STEPS: { return "steps"; }
        case GoalTypes.WEIGHT_LOSS: { return "pounds"; }
        case GoalTypes.MILES: { return "miles"; }
        default: { return "errors"; }
    }
}

export function stringifyGoal(goal) {
    var result = "The current goal is a " + stringifyGoalType(goal.goalType) + ";";
    switch (goal.goalType) {
        case GoalTypes.STEPS: { result += " it is to walk for "; break; }
        case GoalTypes.WEIGHT_LOSS: { result += " it is to lose "; break; }
        case GoalTypes.MILES: { result += " it is to walk for "; break; }
        default: { result += " it is to eliminate "; break; }
    }
    result += stringifyGoalValue(goal.goalValue, goal.goalType) + ". So far, " + goal.goalProgress + "% has been completed.";
    return result;
}