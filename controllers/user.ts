import { v4 } from 'https://deno.land/std/uuid/mod.ts';

export interface User{
    id: string;
    username: string;
    password: string;
    email: string;
    dateOfBirth: Date;
    dateCreated: Date;
}

let userRecords = new Map<string, User>();

userRecords.set(
    "1",
    {
        id: "1",
        username: "Aerith",
        password: "password123",
        email: "Aerith@company.com",
        dateOfBirth: new Date("1985-02-07"),
        dateCreated: new Date()
    }
);


// @desc Get all users
// @route GET /api/v1/users
const getUsers = ({response}: {response: any}) => {
    response.status = 200;
    response.body = {
        success: true,
        data: [ ...userRecords.values() ]
    }
}

// @desc Get a single user by id 
// @route GET /api/v1/users/:id
const getUser = ({params, response}: {params: {id: string}, response: any}) => {
   const user: User | undefined = userRecords.get(params.id);

   if (user){
       response.status = 200;
       response.body = {
           success: true,
           data: user
       }
   }else{
       response.status = 404;
       response.body = {
           success: false,
           msg: "User can't be found"
       }
   }
}

// @desc Adds a single user by id 
// @route POST /api/v1/users
const addUser = async ({request, response}: {request: any, response: any}) => {
    const body = await request.body();

    if (!request.hasBody){
        response.status = 400;
        response.body = {
            success: false,
            msg: "No data provided"
        }
    }else{
            const user: User = body.value;
            user.id = v4.generate();
            userRecords.set(user.id, user);
            
            response.status = 201;
            response.body = {
                success: true,
                data: user
            }
        }
    }

// @desc Updates a single user by id 
// @route PUT /api/v1/users/:id
const updateUser = async ({params,request, response}: {params: {id: string}, request: any, response: any}) => {
    
     if (!request.hasBody){
        response.status = 400;
        response.body = {
            success: false,
            msg: "No data provided"
        };
        return; 
     }
    
    const user: User | undefined = userRecords.get(params.id);
    
    if(user){
        const body = await request.body();
        const updatedUser: {
            username?: string;
            password?: string;
            email?: string;
            dateOfBirth?: Date;
       } = body.value;

       if(updatedUser.username != undefined){
           user.username = updatedUser.username; 
       }
       if(updatedUser.password != undefined){
           user.password = updatedUser.password; 
       }
       if(updatedUser.email != undefined){
           user.email = updatedUser.email; 
       }
       if(updatedUser.dateOfBirth != undefined){
           user.dateOfBirth = updatedUser.dateOfBirth; 
       }

       userRecords.set(user.id, user);
       
       response.status = 201;
       response.body = {
       success: true,
       data: user
       }

    }else{
        response.status = 400;
        response.body = {
            success: false,
            msg: "User could not be found"
        }
    }
}

// @desc Updates a single user by id 
// @route PUT /api/v1/users/:id
const deleteUser = ({params, response}: {params: {id: string}, response: any}) => {
    const user: User | undefined = userRecords.get(params.id);
 
    if (user){
        userRecords.delete(user.id);
        response.status = 200;
        response.body = {
            success: true,
            msg: "Successfully deleted the user"
        }
    }else{
        response.status = 404;
        response.body = {
            success: false,
            msg: "User can't be found"
        }
    }
 }

export { getUsers, getUser, addUser, updateUser, deleteUser};
