// Function to parse the user-agent string and extract device model, OS name, and OS version
module.exports = function parseUserAgent(userAgent) {
  let os = 'Unknown';

  // Parsing logic for iOS devices
  if (userAgent.includes('iPhone')) os = 'IOS';
  // Parsing logic for Android devices
  else if (userAgent.includes('Android')) os = 'Android';
  // Parsing logic for Windows devices
  else if (userAgent.includes('Windows')) {
    os = 'Windows';
  }

  // Parsing logic for Macintosh devices
  else if (userAgent.includes('Macintosh')) {
    os = 'Macintosh';
  }

  // Parsing logic for Linux devices
  else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }

  return os;
};
