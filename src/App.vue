<template>
    <div class="container main">
        <div class="card">
            <div class="card-header header">
                <div class="header-left">
                    <button class="btn btn-outline-dark" @click="upload()">
                        <i class="fa-solid fa-upload"></i>
                        &nbsp;Upload
                    </button>
                    <button class="btn btn-success btn-add" @click="showForm()">
                        <i class="fa-solid fa-circle-plus"></i>
                        &nbsp;Add
                    </button>
                    <Popper :hidden="!isSteps" arrow content="Ctrl+Z" :show="showUndoPopper" placement="right"
                    @click="undoStepAndCheck()">
                        <button
                        @mouseenter="() => showUndoPopper = true"
                        @mouseleave="() => showUndoPopper = false"
                            class="btn btn-outline-dark btn-undo"  >
                            <i style="transform: rotateY(180deg)" class="fa-solid fa-share"></i>
                            &nbsp;Undo
                        </button>
                    </Popper>

                </div>
                <div class="header-right">
                    <button class="btn btn-primary" @click="toggleModal()">
                        <i class="fa-solid fa-floppy-disk"></i>
                        &nbsp;Save
                    </button>
                </div>
            </div>
            <ul class="list-group list-group-flush" v-if="isShowForm">
                <li class="list-group-item">
                    <form class="student-form">
                        <Popper arrow class="formError" :show="v$.name.$dirty && v$.name.$error"
                        :content="getNameError">
                            <input 
                            v-model.trim="v$.name.$model" 
                            class="form-control text1" 
                            id="name" 
                            ref="input" 
                            placeholder="Name*"
                            type="text"
                            :class="v$.name.$error ? 'error' : ''"
                             />
                        </Popper>
                        <Popper arrow class="formError" :show="v$.surname.$dirty && v$.surname.$error"
                        :content="getSurnameError" placement="top">
                            <input 
                            v-model.trim="v$.surname.$model" 
                            class="form-control text2" 
                            id="surname" 
                            placeholder="Surname*"
                            type="text"
                            :class="v$.surname.$error ? 'error' : ''"
                             />
                        </Popper>
                        <Popper arrow class="formError" :show="v$.date.$dirty && v$.date.$error"
                        content="Please pick any date" placement="bottom">
                            <input 
                            v-model="v$.date.$model"
                            class="form-control date" 
                            type="date"
                            :class="v$.date.$error ? 'error' : ''"
                             />
                        </Popper>
                        <div v-for="i in markCount" :key="i" class="marks_select">
                        <select class="form-select" :id="`select${i}`" v-model="marks[i]">
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        </div>
                        <button 
                            type="submit" 
                            class="btn btn-success btn-submit"
                            @click.prevent="addStudent()">
                            <i class="fa-solid fa-circle-plus"></i>
                        &nbsp;Add
                        </button>
                    </form>
                </li>
            </ul>
            <div class="card-body">
                <table class="table table-striped" v-if="students && students.length">
                    <thead>
                        <th style="width: 20%;" class="heading-text">Name</th>
                        <th style="width: 20%;" class="heading-text">Surname</th>
                        <th style="width: 20%;"><div class="birth">Birth
                            <Popper
                            @click="sortByDate()"
                            class="fw-normal" 
                            arrow 
                            content="Sort students by age" 
                            :show="showSortPopper"
                            placement="top"
                            >
                                <div tabindex="0" class="birth-btn"
                                @mouseenter="() => showSortPopper = true"
                                @mouseleave="() => showSortPopper = false">
                                    <i :class="{'fa-solid fa-caret-up' : !sortDesc,
                                    'fa-solid fa-caret-down' : sortDesc}"></i> 
                                </div>
                                </Popper>
                            </div>
                        </th>
                        <th style="width: 20%;"><div class="marks">Marks
                            <Popper
                            @click="filterByGrade()"
                            class="fw-normal" 
                            arrow 
                            content="Delete students who don't have 5" 
                            :show="showMarkPopper"
                            placement="top">
                                <div class="marks-btn"
                                 tabindex="0"
                                 @mouseenter="() => showMarkPopper = true"
                                 @mouseleave="() => showMarkPopper = false">                           
                                    <i class="fa-solid fa-filter"></i>
                                </div>
                            </Popper> 
                            </div>
                        </th>
                        <th style="width: 20%;">
                        <div class="average">Average
                            <Popper
                            @click="deleteWithHighAvg()"
                            class="fw-normal" 
                            arrow 
                            content="Delete students who don't have 5" 
                            :show="showAvgPopper"
                            placement="top">
                                <div class="average-btn" tabindex="0"
                                @mouseenter="() => showAvgPopper = true"
                                @mouseleave="() => showAvgPopper = false">                           
                                    <i class="fa-solid fa-filter"></i>
                                </div> 
                            </Popper>
                            </div>
                        </th>
                    </thead>
                    <tbody>
                        <tr v-for="(student, idx) in studentsToShow" :key="student.surname + idx" class="student-item">
                            <td>{{student.name}}</td>
                            <td>{{student.surname}}</td>
                            <td>{{student.birth}}</td>
                            <td>{{student.marks.join("  ")}}</td>
                            <td>{{getAverage(student.marks).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="no-data" v-else>
                    <img src="./assets/no_data.png" alt="No data">
                </div>
            </div>
        </div>
        <div class="background" v-if="isModalOpen">
            <div class="card modal_confirm">
                <div style="display: flex;justify-content: space-between;" 
                class="card-header">
                    <h1>Download file?</h1>
                    <i style="opacity: 0.7; cursor: pointer; margin-left: 20px;" 
                    class="fa-solid fa-xmark" @click="() => isModalOpen = false"></i>
                </div>
                <div class="modal-buttons card-body">
                    <button class="btn btn-success" @click="downloadText()">
                        <i class="fa-solid fa-download"></i>
                        Donwload
                    </button>
                    <button class="btn btn-danger" @click="clearSteps()">
                        <i class="fa-solid fa-circle-xmark"></i>
                        No
                    </button>
                </div>
            </div>
        </div>
        <div class="background" v-if="!isLoaded">
            <div style="position: absolute; top: 270px; right: 730px;">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, alpha} from '@vuelidate/validators'
import {mapGetters, mapMutations} from 'vuex'
import Popper from 'vue3-popper'
import "bootstrap"
import { useToast } from "vue-toastification";

export default {
  setup () {
    return { 
        v$: useVuelidate(),
        toast$: useToast()
    }
  },
    components: {
        Popper
    },
    data() {
        return {
            markCount: [0, 1, 2, 3, 4, 5, 6, 7],
            showUndoPopper: false,
            showSortPopper: false,
            showAvgPopper: false,
            showMarkPopper: false,
            isFilterd: false,
            isAvgFiltered: false,
            isShowForm: false,
            isLoaded: true,
            isModalOpen: false,
            sortDesc: true,
            nameError: false,
            surnameError: false,
            dateError: false,
            marksError: false,
            name: '',
            surname: '',
            date: new Date('2017-07-20').toISOString().substr(0,10),
            // marks: {
            //     mark1: '',
            //     mark2: '',
            //     mark3: '',
            //     mark4: '',
            //     mark5: '',
            //     mark6: '',
            //     mark7: '',
            //     mark8: ''
            // }
            marks: ['1','1','1','1','1','1','1','1']
        }
    },
    validations() {
        return {
            name: {
                required, alpha
            },
            surname: {
                required, alpha
            },
            date: {required}
        }
    },
    mounted() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        let students = JSON.parse(localStorage.getItem("students"))
        if(students && students.length) {
            this.setStudents(students)
        }
        this.checkForSteps()
        document.addEventListener('keydown', (e) => {
            if(e.ctrlKey && e.key === 'z') {
                this.undoStep()
                this.checkForSteps()
                this.isFilterd = false
                this.isAvgFiltered = false
            }
        });
    },
    computed: {
        ...mapGetters({
            students: 'students',
            isSteps: 'isSteps'
        }),
        studentsToShow() {
            return this.students.filter(s => s.show)
        },
        getNameError() {
            let msg = ''
            if(this.v$.name.required.$invalid) {
                msg = 'Please, fill this field'
            }
            if(this.v$.name.alpha.$invalid) {
                msg = 'Name must contain only characters [a-z][A-Z]'
            }
            return msg;
        },
        getSurnameError() {
            let msg = ''
            if(this.v$.surname.required.$invalid) {
                msg = 'Please, fill this field'
            }
            if(this.v$.surname.alpha.$invalid) {
                msg = 'Surname must contain only characters [a-z][A-Z]'
            }
            return msg;
        }
    },
    watch: {
        isShowForm(prev) {
            if(prev === true) {
                setTimeout(() => {
                    this.$refs.input.focus()
                }, 100)
            }
        },
    },
    methods: {
        upload() {
            let input  = document.createElement('input')
            input.type = 'file'
            input.setAttribute("accept", ".txt")
            input.click()
            input.onchange = _ => {
                if(!input.files) {
                    return
                }
                this.isLoaded = false
                const ext = this.getExtension(input.files[0].name)
                console.log(ext);
                if(ext !== 'txt') {
                    this.toast$.warning('You are trying to open file with incorrect type. Please, choose file with .txt extension!')
                    return
                }
                let fr=new FileReader();
                fr.onload = () => {
                              let lines = fr.result.split('\n')
                    let data = [];
                    lines.forEach(line => {
                            line = line.replace("\r", '')
                            let item = line.split(' ')
                            let student = {
                                name: item[0],
                                surname: item[1],
                                birth: item[2],
                                marks: item.slice(3, item.length),
                                show: true
                            }
                            if(this.validateStudent(student)) {
                                data.push(student)
                            }
                    })
                    this.setStudents(data)
                    this.addStep(data)
                    setTimeout(() => {
                        this.isLoaded = true
                    }, 1000)
                }
                fr.readAsText(input.files[0]);
            }
        },
       validateStudent(student) {
            if(!student.name || student.name.trim() === "") {
                return false
            }
            if(!student.surname || student.surname.trim() === "") {
                return false
            }
            if(!student.birth) {
                return false
            }
            if(!student.marks || student.marks.length !== 8) {
                return false
            }
            student.marks.forEach(m => {
                if(!m) {
                    return false
                }
            })
            return true
        },
        showForm() {
            this.isShowForm = !this.isShowForm
            this.v$.$reset()
        },
        sortByDate() {
            let temp = this.students.slice(0, this.students.length)
            temp.sort((s1, s2) => {
                let date1 = s1.birth.split(".")
                let date2 = s2.birth.split(".")
                return new Date(`${date1[2]}/${date1[1]}/${date1[0]}`) - 
                    new Date(`${date2[2]}/${date2[1]}/${date2[0]}`)
            })
            if(this.sortDesc) {
                this.sortDesc = false
            } else {
                temp.reverse()
                this.sortDesc = true
            }
            this.addStep(temp)
            this.setStudents(temp)
        },
        filterByGrade() {
            if(!this.isFilterd){
                let temp = this.students.slice(0, this.students.length)
                temp = temp.map(s => {
                    if(!s.marks.includes('5')) {
                        return {...s, show: false}
                    } else {
                        return s
                    }
                })
                this.setStudents(temp)
                this.addStep(temp)
            }
            this.isFilterd = true
        },
        getAverage(values) {
            return values.reduce((acc, val) => Number(acc) + Number(val)) / values.length
        },
        deleteWithHighAvg() {
            if(!this.isAvgFiltered) {
                let temp = this.students.slice(0, this.students.length)
                let avgs = []
                temp.forEach(s => avgs.push(this.getAverage(s.marks)))
                let groupAvg = this.getAverage(avgs)
                temp = temp.map(s => {
                    if(this.getAverage(s.marks) > groupAvg) {
                        return {...s, show: false}
                    } else {
                        return s
                    }
                })
                this.setStudents(temp)
                this.addStep(temp)
            }
            this.isAvgFiltered = true
        },
        undoStepAndCheck() {
            this.undoStep()
            this.checkForSteps()
            this.isFilterd = false
            this.isAvgFiltered = false
        },
        downloadText() {
            let text = ""
            this.students.forEach(s => {
                if(s.show){
                    let newObj = {
                    name: s.name,
                    surname: s.surname,
                    birth: s.birth,
                    marks: s.marks
                }
                let elements = Object.values(newObj)
                text += elements.join(" ").replaceAll(","," ") + "\n"
                }
            })
            let blob = new Blob([ text ], { "type" : "text/plain" })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'results.txt'
            link.click()
            this.toast$.success("Changes are successfully saved!")
            localStorage.setItem("steps", JSON.stringify([]))
            this.checkForSteps()
            this.isModalOpen = false
        },
        addStudent() {
            this.v$.$touch()
            if(this.v$.$invalid) {
                this.toast$.error("Student data is invalid. Please, check the form!")
                return
            }
            let date = this.date.split('-')
            let marks = [...this.marks]
            let data = {
                name: this.name,
                surname: this.surname,
                birth: `${date[2]}.${date[1]}.${date[0]}`,
                marks,
                show: true
            }        
            this.appendStudent(data)
            this.addStep(this.students)  
            this.isShowForm = false
            this.name = ''
            this.surname = '' 
            this.date = new Date('2017-07-20').toISOString().substr(0,10)
            this.marks = ['1', '1', '1', '1', '1', '1', '1', '1']
            this.v$.$reset()
        },
        clearSteps() {
            localStorage.setItem("steps", JSON.stringify([]))
            this.checkForSteps()
            this.isModalOpen = false
            this.toast$.success("Changes are successfully saved!")
            this.toast$.info("List was saved in browser, to make sure that your data will not be lost please download file on yout computer")
        },
        getExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        },
        toggleModal() {
            if(!this.students || !this.students.length) {
                this.toast$.warning("There is no data to save, try to load it first")
                return
            }
            this.isLoaded = false
            setTimeout(() => {
                this.isLoaded = true
                this.isModalOpen = true
            }, 500);
            
        },
        ...mapMutations({
            setStudents: 'setStudents',
            appendStudent: 'appendStudent',
            checkForSteps: 'checkForSteps',
            addStep: 'addStep',
            undoStep: 'undoStep'
        }),
    }
}
</script>

<style>
    :root {
    --popper-theme-background-color: #333333;
    --popper-theme-background-color-hover: #333333;
    --popper-theme-text-color: #ffffff;
    --popper-theme-border-width: 0px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 6px;
    --popper-theme-padding: 8px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    }
    .main {
        padding-top: 25px;
    }
    .header{
        display: flex;
        justify-content: space-between;
    }
    .btn-add {
        margin-left: 15px;
        margin-right: 30px;
    }
    .marks {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: baseline;
    }
    .heading-text {
        padding: 0.5em;
    }
    .birth {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: baseline;
    }
    .birth-btn {
        cursor: pointer;
        margin-left: 5px;
        width: 20px;
        display: flex;
        justify-content: center;
        opacity: 0.3;
    }
    .marks-btn {
        cursor: pointer;
        margin-left: 5px;
        width: 20px;
        display: flex;
        justify-content: center;
        opacity: 0.3;
    }
    .average {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: baseline;
    }
    .average-btn {
        cursor: pointer;
        margin-left: 5px;
        width: 20px;
        display: flex;
        justify-content: center;
        opacity: 0.3;
    }
    .average-btn:hover, .marks-btn:hover, .birth-btn:hover {
        transition: 0.2s;
        opacity: 1;
    }
    .student-form {
        display: flex;
        justify-self: space-between;
        position: relative;
    }
    .text1 {
        max-width: 190px
    }
    .text2 {
        margin-left: 10px;
        margin-right: 40px;
        max-width: 190px
    }
    .date {
        max-width: 140px;
        margin-right: 40px;
    }
    .marks_select {
       padding-right: 10px; 
    }
    .btn-submit {
        position: absolute;
        top: 0;
        right: 0;
    }
    .no-data {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.1;
        padding-top: 40px;
        padding-bottom: 40px;
    }
    .formError {
        --popper-theme-background-color: #ffffff;
        --popper-theme-background-color-hover: #ffffff;
        --popper-theme-text-color: #cc2d2d;
        --popper-theme-border-width: 1px;
        --popper-theme-border-style: solid;
        --popper-theme-border-color: #cc2d2d;
        --popper-theme-border-radius: 6px;
        --popper-theme-padding: 8px;
        --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    }
    .error {
        border-color: #cc2d2d!important;        
    }
    .background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        backdrop-filter: blur(5px);
    }
    .modal_confirm {
        max-width: fit-content;
        z-index: 1000;
        position: fixed;
        top: 150px;
        left: 580px;
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    }
    .modal-buttons {
        display: flex;
        justify-content: space-between;
    }
    .modal-buttons > button {
        width: 100%;
        margin: 5px;
    }
    /* Loader */
    .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
        z-index: 1000
    }
    .lds-ellipsis div {
        position: absolute;
        top: 33px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: #0b5ed7;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
    }
    @keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
    }
    @keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(24px, 0);
    }
    }
</style>
