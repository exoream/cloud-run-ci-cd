const { successWithDataResponse, errorResponse } = require("../../../utils/helper/response");
const { ValidationError } = require("../../../utils/helper/response")
const { message } = require("../../../utils/constanta/constanta");
const loadModel = require("../model/model");

class ScanController {
  constructor(scanService) {
    this.scanService = scanService;
  }

  async predict(req, res) {
    try {
      const image = req.file;
      const model = await loadModel();
      const { label, probability, description } = await this.scanService.predict(image, model);
      return res.status(200).json({ status: true, message: "Success scan", data: { label, probability, description } });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({ status: false, message: error.message });
      } else {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
      }
    }
  }
  
}

module.exports = ScanController;
