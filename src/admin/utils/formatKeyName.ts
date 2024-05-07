const formatKeyName = (keyName) => {
  const parts = keyName.split('.');
  if (parts.length > 1) {
    return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return keyName;
};

export default formatKeyName;
