import {createStore} from 'vuex';
import actions from "@/store/actions";

const store = createStore({
  state() {
    return {
      desserts: []
    }
  }, mutations: {
    set_desserts(state, desserts) {
      state.desserts = desserts;
    }
  }, actions
  , getters: {
    // Định nghĩa các getters để lấy dữ liệu từ trạng thái
  },
});

export default store;
