function me(req, res) {
  const user = { ...req.currentUser };
  delete user.passwordHash;
  return res.json({ success: true, user });
}

module.exports = { me };
