import axios from "axios";

export default {
  async GetAllTask({commit}) {
    try {
      await axios.get("http://localhost:4040/api/tasks").then((res) => {
        const desserts = res.data.taskList;
        commit("set_desserts", desserts)
      }).catch(err => {
        console.log(err.message)
      })
    } catch (err) {
      console.log(err)
    }

  },
}
