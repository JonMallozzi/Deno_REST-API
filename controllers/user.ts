import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { Client } from "https://deno.land/x/postgres/mod.ts";
import {dbCreds} from "../config.ts";

//Init Client
const client = new Client(dbCreds);

export interface User{
    id: string;
    username: string;
    password: string;
    email: string;
    dateOfBirth: Date;
    dateCreated: Date;
}

// @desc Get all users
// @route GET /api/v1/users
const getUsers = async ({response}: {response: any}) => {
    try {
        await client.connect();

        const result = await client.query("SELECT * FROM users");

        const users: any = new Array();

        result.rows.map((user: any) => {
            let obj: any = new Object();

            result.rowDescription.columns.map((element,id) => {
                obj[element.name] = user[id];
            })
            users.push(obj);
        })

        response.status = 200;
        response.body = {
        success: true,
        data: users
        }
    } catch(err){
        response.status = 500;
        response.body = {
            success: false,
            msg: err.toString()
        }
    } finally {
        await client.end()
    }
    
}

// @desc Get a single user by id 
// @route GET /api/v1/users/:id
const getUser = async({params, response}: {params: {id: string}, response: any}) => {
    try{
        await client.connect()

        const result = await client.query("SELECT * FROM users where id = $1", params.id);

        if(result.rows.toString() === "") {
            response.status = 404;
            response.body = {
                success: false,
                msg: `User not found with the id of ${params.id}`
            }
        } else {
            const user: any = new Object();

            result.rows.map(u => {
                result.rowDescription.columns.map((element, id) => {
                    user[element.name] = u[id];
                })
            })

            response.status = 200;
            response.body = {
                success: true,
                data: user
            }
        }
    } catch(err){
        response.status = 500;
        response.body = {
            success: false,
            msg: err.toString()
        }
    } finally {
        await client.end();
    }
}

// @desc Adds a single user by id 
// @route POST /api/v1/users
const addUser = async ({request, response}: {request: any, response: any}) => {
    const body = await request.body();
    const user = body.value;

    if (!request.hasBody){
        response.status = 400;
        response.body = {
            success: false,
            msg: "No data provided"
        }
    }else{
           try {
               await client.connect();

               const result = await client.query(`INSERT INTO users (username, password, email, dateOfBirth) 
                VALUES($1,$2,$3,$4)`, 
                user.username,
                user.password,
                user.email,
                user.dateOfBirth);

                response.status = 201;
                response.body = {
                    success: true,
                    data: user
                };
           } catch (err){ 
              response.status = 500;
              response.body = {
                  success: false,
                  msg: err.toString()
              }
           } finally {
               await client.end()
           }
        }
    }

// @desc Updates a single user by id 
// @route PUT /api/v1/users/:id
const updateUser = async ({params,request, response}: {params: {id: string}, request: any, response: any}) => {
    //checking if the user being update exists by getting it
    await getUser({params: {"id" : params.id}, response});

    if(response.status === 404){
        response.body = {
            success: false,
            msg: response.body.msg
        }
        response.status = 404
        return;
    }else{
        const body = await request.body();
        const user = body.value;

        if (!request.hasBody){
            response.status = 400;
            response.body = {
                success: false,
                msg: "No data provided"
            }
        }else{
               try {
                   await client.connect();
    
                   const result = await client.query(`UPDATE users SET username=$1,
                    password=$2, email=$3, dateOfBirth=$4 WHERE id=$5`, 
                    user.username,
                    user.password,
                    user.email,
                    user.dateOfBirth,
                    params.id);
    
                    response.status = 201;
                    response.body = {
                        success: true,
                        data: user
                    };
               } catch (err){ 
                  response.status = 500;
                  response.body = {
                      success: false,
                      msg: err.toString()
                  }
               } finally {
                   await client.end()
               }
            }
    }
}

// @desc Updates a single user by id 
// @route PUT /api/v1/users/:id
const deleteUser = async({params, response}: {params: {id: string}, response: any}) => {
  //checking again if the user being update exists by getting it
  await getUser({params: {"id" : params.id}, response});

  if(response.status === 404){
      response.body = {
          success: false,
          msg: response.body.msg
      }
      response.status = 404
      return;
  }else{
      try {
          await client.connect()

          const result = await client.query("DELETE FROM users WHERE id=$1", params.id);
        
          response.status = 204;
          response.body = {
              success: true,
              msg: `Product with id ${params.id}`
          }
      }catch(err) {
        response.status = 500;
        response.body = {
            success: false,
            msg: err.toString()
        }
      }finally {
        await client.end();
      }
  }
 }

export { getUsers, getUser, addUser, updateUser, deleteUser};
