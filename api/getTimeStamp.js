// ==================================================================
// Each record is marked with a unique timestamp to keep clients synchronized
// ==================================================================

module.exports = function getTimeStamp() {
    var timeStampISO = new Date().toISOString();
    //console.log('timestamp ' + timeStampISO);
    return timeStampISO;
}