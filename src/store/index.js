import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            students: [],
            steps: []
        }
    },
    actions: {

    },

    mutations: {
        setStudents(state, data) {
            state.students = data
            localStorage.setItem("students", JSON.stringify(state.students))
        },
        appendStudent(state, data) {
            state.students.push(data)
            localStorage.setItem("students", JSON.stringify(state.students))
        },
        checkForSteps(state) {
            let steps = JSON.parse(localStorage.getItem("steps"))
            if(steps && steps.length) {
                state.steps = steps
            } else {
                state.steps = []
                localStorage.setItem("steps", JSON.stringify([]))
            }
        },
        addStep(state, data) {
            state.steps = JSON.parse(localStorage.getItem("steps"))
            state.steps.push(data)
            localStorage.setItem("steps", JSON.stringify(state.steps))
        },
        undoStep(state) {
            let steps = JSON.parse(localStorage.getItem("steps"))
            if(steps && steps.length > 1) {
                steps.pop()
                state.students = steps[steps.length - 1]
                localStorage.setItem("students", JSON.stringify(state.students))
                localStorage.setItem("steps", JSON.stringify(steps))
            }            
        },
    },
    getters: {
        students(state) {
            return state.students
        },
        isSteps(state) {
            if(state.steps && state.steps.length > 1) {
                return true
            } else {
                return false
            }
        }
    }
})