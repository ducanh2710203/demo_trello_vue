

<template>
  <v-col
    cols="12"
    sm="4"
  >
    <v-sheet class=" ma-2 pa-2 ">
      <v-card @drop="onDrop($event, 'to-do')" @dragover.prevent @dragenter.prevent class=" mt-16 " color="primary"
              title="To do" variant="elevated">
        <div class="task ma-4 pa-4 rounded">
          <div class="scrollable">
            <div v-for="(item ) in desserts.filter(item=>item.progress=== 'to-do').reverse()"
                 :key="item.taskName"
                 draggable="true"
                 @dragstart="startDrag($event, item.id,'to-do')">
              <div class="v-picker--full-width border pa-4 ma-2 rounded text-black">
                {{ item.id }}. {{ item.taskName }}
                <v-btn class="float-right" variant="text" @click="openDialog(item.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       class="bi bi-gear" viewBox="0 0 16 16">
                    <path
                      d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path
                      d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                </v-btn>
                <hr class="my-4">
                <div>
                </div>
              </div>
            </div>
          </div>

          <div class="v-picker--full-width  ma-2 rounded text-black">
            <v-text-field label="Add task" v-model="newTaskName1" variant="outlined"></v-text-field>
            <v-btn color="success" @click="addTodo" variant="flat">
              Add
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-sheet>
  </v-col>
</template>
<script>
import axios from "axios";
import {mapActions, mapState} from "vuex";

export default {
  data() {

    return {
      // desserts: [],
      newTaskName1: "",
      newTaskName2: "",
      newTaskName3: "",
      currentTask: {
        id: 0,
        taskName: ""
      },
      dialog: false,
    }
  },
  mounted() {

    this.GetAllTask()
  },

  computed: {
    ...mapState({
      desserts: state => state.desserts
    })
  },

  methods: {

    ...mapActions(['GetAllTask']),
    // getAllTask() {
    //   axios.get("http://localhost:4040/api/tasks").then((res) => {
    //     this.desserts = res.data.taskList;
    //
    //   }).catch(err => {
    //     console.log(err.message)
    //   })
    // },
    addTodo() {
      if (this.newTaskName1 !== "") {
        const newTask = {
          taskName: this.newTaskName1,
          progress: "to-do",
        }
        axios.post('http://localhost:4040/api/tasks', newTask).then(() => {
          this.GetAllTask()
          this.newTaskName1 = ""
        }).catch(error => {
          console.error('Lỗi khi gọi API:', error);
        })
      }
    },

    openDialog(id) {
      this.dialog = true
      axios.get(`http://localhost:4040/api/tasks/${id}`)
        .then(response => {
          this.currentTask.taskName = response.data.taskList.taskName;
        })
        .catch(error => {
          console.error('Lỗi khi gọi API:', error);
        });
      this.currentTask.id = id
    },
    deleteTask(id) {
      this.dialog = false
      axios.delete(`http://localhost:4040/api/tasks/${id}`)
        .then(response => {
          this.desserts = response.data.taskList;
          this.GetAllTask()
        })
        .catch(error => {
          console.error('Lỗi khi gọi API:', error);
        });
    },
    editTaskName(id) {
      this.dialog = false
      const updatedTaskName = {
        taskName: this.currentTask.taskName
      }
      axios.put(`http://localhost:4040/api/tasks/${id}`, updatedTaskName)
        .then(() => {
          this.GetAllTask()
        })
        .catch(error => {
          console.error('Lỗi khi gọi API:', error);
        });
    },
    startDrag(evt, item) {
      axios.get(`http://localhost:4040/api/tasks/${item}`)
        .then(response => {
          this.currentTask.id = response.data.taskList.id;
        })
        .catch(error => {
          console.error('Lỗi khi gọi API:', error);
        });
    },
    onDrop(evt, progress) {
      const updatedProgress = {
        progress: progress
      }
      axios.put(`http://localhost:4040/api//tasks/${this.currentTask.id}/progress`, updatedProgress)
        .then(() => {
          this.GetAllTask()
        }).catch(err => {
        console.log(err.message)
      })

    },
  }
}

</script>

<style >
.task {
  background-color: #FAFAFA;
}
.scrollable {
  overflow: auto;
  max-height: 420px;
}
.scrollable::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
.scrollable::-webkit-scrollbar-thumb {
  background-color: #fafafa;
  border-radius: 60px;
}

.scrollable::-webkit-scrollbar-track {
  background-color: #fafafa;
  border-radius: 60px;
}
</style>
