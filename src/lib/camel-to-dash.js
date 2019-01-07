module.exports = function(str) {
    return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);
};
