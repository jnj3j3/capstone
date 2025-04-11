"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errConfig = errConfig;
function errConfig(res, err, message) {
    if (err != null)
        console.log(err + " error occured while " + message);
    res.status(500).send({
        message: " This error occured while " + message,
    });
}
//# sourceMappingURL=err.config.js.map