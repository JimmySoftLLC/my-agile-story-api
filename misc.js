const arrayDifference = (a1, a2) => {
    let difference = [];
    for (let i = 0; i < a1.length; i++) {
        let foundOne = false;
        for (j = 0; j < a2.length; j++) {
            if (a1[i] == a2[j]) {
                foundOne = true;
            }
            if (foundOne) break;
        }
        if (!foundOne) {
            difference.push(a1[i])
        }
    }
    return difference
}

module.exports = {
    arrayDifference: arrayDifference,
};