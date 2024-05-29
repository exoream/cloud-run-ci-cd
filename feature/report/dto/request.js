function reportRequest(body) {
  const {
    location,
    reference_location,
    latitude,
    longitude,
    description,
    user_id,
  } = body;
  return {
    location,
    referenceLocation: reference_location,
    latitude,
    longitude,
    description,
    userId: user_id,
  };
}

module.exports = { reportRequest };
