function reportResponse(report) {
  const response = {
    id: report.id,
    location: report.location,
    reference_location: report.referenceLocation,
    latitude: report.latitude,
    longitude: report.longitude,
    image: report.image,
    status_damage: report.statusDamage,
    description: report.description,
    status: report.status,
    like: report.like,
    created_at: report.createdAt,
  };
  return response;
}

function reportListResponse(reportlist) {
  const response = reportlist.map((report) => reportResponse(report));
  return response;
}

module.exports = { reportResponse, reportListResponse };
