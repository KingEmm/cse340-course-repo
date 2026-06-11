
const getHome = async (req, res) => {
  const title = 'Home';
  console.log("Flash messages:", req.flash("HELLO")); // Log flash messages for debugging
  res.render('home', { title });
};

export { getHome };