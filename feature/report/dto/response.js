function reportResponse(report) {
  const response = {
    id: report.id,
    location: report.location,
    reference_location: report.referenceLocation,
    latitude: report.latitude,
    longitude: report.longitude,
    image: report.image,
    description: report.description,
    status: report.status,
    created_at: report.createdAt,
  };
  return response;
}

function reportListResponse(reportlist) {
  const response = reportlist.map((report) => reportResponse(report));
  return response;
}

module.exports = { reportResponse, reportListResponse };
