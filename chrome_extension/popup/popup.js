let tasks = []

function updateTime() {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
        const time = document.getElementById("time")
        const mins = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0")
        let secs = "00"
        if (res.timer % 60 != 0) {
            secs = `${60 - res.timer % 60}`.padStart(2, "0")

        }
        time.textContent = `${mins}:${secs}`
    })
}


updateTime()
setInterval(updateTime, 1000)

const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "pause ✮" : "start timer ☆"
        })
    })
})


const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerBtn.textContent = "start timer ☆"
    })
})
const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener("click", () => addTask())


chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})


function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    })
}


function renderTask(tasksNum) {
    const taskRow = document.createElement("div")
    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "click here to enter a task!"
    text.value = tasks[tasksNum]
    text.className = "task-input"
    text.addEventListener("change", () => {
        tasks[tasksNum] = text.value
        saveTasks()
    })


    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.className = "task-delete"
    deleteBtn.addEventListener("click", () => {
        deleteTask(tasksNum)
    })


    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)


    const taskContainer = document.getElementById("task-container")
    taskContainer.appendChild(taskRow)


}


function addTask() {
    const tasksNum = tasks.length
    tasks.push("")
    renderTask(tasksNum)
    saveTasks()
}


function deleteTask(tasksNum) {
    tasks.splice(tasksNum, 1)
    renderTasks()
    saveTasks()
}


function renderTasks() {
    const taskContainer = document.getElementById("task-container")
    taskContainer.textContent = ""
    tasks.forEach((text, tasksNum) => {
        renderTask(tasksNum)
    })
}

