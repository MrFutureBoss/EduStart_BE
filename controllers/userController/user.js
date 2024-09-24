import userDAO from "../../repositories/userDAO/index.js";

const getUserLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await userDAO.loginUser({ email, password });
      res.status(200).json({ token }); 
    } catch (error) {
      if (error.message === "Wrong password.") {
        return res.status(401).json({ error: error.message });
      }
      if (error.message === "User not found.") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
  
export default {
    getUserLogin,
}