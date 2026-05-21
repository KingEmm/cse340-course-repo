
const getHome = async (req, res) => {
  const title = 'Home';
  res.render('home', { title });
};

export { getHome };