function reportResponse(report) {
  const response = {
    id: report.id,
    location: report.location,
    reference_location: report.reference_location,
    latitude: report.latitude,
    longitude: report.longitude,
    image: report.image,
    description: report.description,
    user_id: report.id_user,
    status: report.status,
  };
  return response;
}

function reportListResponse(reportlist) {
  const response = reportlist.map((report) => reportResponse(report));
  return response;
}

module.exports = { reportResponse, reportListResponse };
