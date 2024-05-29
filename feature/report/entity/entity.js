class ReportCore {
  constructor(
    id,
    location,
    referenceLocation,
    latitude,
    longitude,
    image,
    description,
    userId,
    status
  ) {
    this.id = id;
    this.location = location;
    this.referenceLocation = referenceLocation;
    this.latitude = latitude;
    this.longitude = longitude;
    this.image = image;
    this.description = description;
    this.userId = userId;
    this.status = status;
  }
}

module.exports = ReportCore;
