const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Employee Management API',
            version:'1.0.0',
            description:'Employee Api for employee management',
            contact:{
                name:'Gowrishankar',
                url:'https://google.com',
                email:'gowris.dev@gmail.com'
            },
            servers:["http://localhost:3000"]
        }
    },
    apis:["index.js"]
}
const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

//json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());
app.use(cors());

/**
 * @swagger
 * definitions:
 *  Employee:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     description: name of the employee
 *     example: 'Jeson Elliot'
 *    date_of_joining:
 *     type: string
 *     description: date of joining of the employee
 *     example: '2021-01-30'
 *    email:
 *     type: string
 *     description: email of the employee
 *     example: 'jeson.dev@gmail.com'
 *    gender:
 *     type: string
 *     description: gender of the employee
 *     example: 'male'
 *    bio:
 *     type: string
 *     description: biography of the employee
 *     example: 'Currently, staying in Sydney'
 *    designation:
 *     type: string
 *     description: designation of the employee
 *     example: 'Software Engineer'
 


/**
  * @swagger
  * /employee:
  *  post:
  *   summary: create employee
  *   description: create employee for the organisation
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/Employee'
  *   responses:
  *    200:
  *     description: Employee created succesfully
  *    500:
  *     description: failure in creating employee
  */

  // saving employee
app.post("/employee", async(req,res)=>{
    try{
    const{name,date_of_joining,designation,gender,email,bio} = req.body;
    const employeeData = await pool.query("INSERT INTO EMPLOYEE(name,date_of_joining,designation,gender,email,bio) values($1,$2,$3,$4,$5,$6) returning *",[name,date_of_joining,designation,gender,email,bio]);
    console.log(req.body); 
    console.log(name);
    res.json(employeeData.rows[0]);
    }catch(error){
        res.status(500).json(error);
    }
})
// saving team employee
app.post("/team", async(req,res)=>{
    try{
    const{name,email,description} = req.body;
    const teamData = await pool.query("INSERT INTO TEAM(name,email,description) values($1,$2,$3) returning *",[name,email,description]);
    console.log(req.body); 
    console.log(name);
    res.json(teamData.rows[0]);
    }catch(error){
        res.status(500).json(error);
    }
})

//saving in employee assignment
app.post("/employeeassignment", async(req,res)=>{
    try{
    const{employee_id,team_id} = req.body;
    const employeeAssignmentData = await pool.query("INSERT INTO EMPLOYEE_ASSIGNMENT(employee_id,team_id) values($1,$2) returning *",[employee_id,team_id]);
    console.log(req.body); 
    //console.log(name);
    res.json(employeeAssignmentData.rows[0]);
    }catch(error){
        res.status(500).json(error);
    }
})

/**
 * @swagger
 * /employees:
 *  get:
 *   summary: get all employees
 *   description: get all employees
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */

// getting all the employee
app.get('/employees',async(req,res)=> {
    try{
        const allEmployees = await pool.query("SELECT * FROM EMPLOYEE");
        res.json(allEmployees.rows);
    }catch(error){
        res.status(500).json(error);
    }
})
//getting all team employeea
app.get("/teams",async(req,res)=>{
    try{
   const allTeam = await pool.query("SELECT * FROM TEAM");
   res.json(allTeam.rows);
    }catch(error){
        res.status(500).json(error);
    }
})

/**
 * @swagger
 * /employee/{employee_id}:
 *  get:
 *   summary: get employee
 *   description: get employee
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */


// getting employee based on id
// employee/1
app.get("/employee/:id",async(req,res)=>{
    const {id} = req.params;
    try{
   const employee = await pool.query("SELECT * FROM EMPLOYEE WHERE id = $1",[id]);
   res.json(employee.rows);
    }catch(error){
        res.status(500).json(error);
    }
})

/**
 * @swagger
 * /employee/{id}:
 *  put:
 *   summary: update employee
 *   description: update employee
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Team'
 */


// update employee
app.put('/employee/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const{name,date_of_joining,designation,gender,email,bio} = req.body;
        const updateEmployee = await pool.query("UPDATE EMPLOYEE SET name=$1,date_of_joining=$2,designation=$3,gender=$4,email=$5,bio=$6 where id=$7 returning *", [name,date_of_joining,designation,gender,email,bio,id] )
        res.json(updateEmployee.rows[0]);
    }catch(error){
        res.status(500).json(error);
    }
})

/**
 * @swagger
 * /employee/{employee_id}:
 *  delete:
 *   summary: delete employee
 *   description: delete employee
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */



// deleting employee
app.delete('/employee/:id', async(req,res)=>{
    try{
        const {id} = req.params;
       const deleteEmployee = await pool.query("DELETE FROM EMPLOYEE WHERE id=$1",[id]);
       res.json(`Successfully deleted employee with ID - ${id}`);
       console.log(`Deleted employee with ID -  ${id}`);
    }catch(error){
        res.status(500).json(error);
    }
})






app.listen(3000, ()=>{
    console.log("Message from index.js - server listening in port 3000");
})