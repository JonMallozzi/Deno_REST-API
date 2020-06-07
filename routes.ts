import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getUsers, getUser, addUser, updateUser, deleteUser} from "./controllers/user.ts"

const router = new Router();

router.get('/api/v1/users', getUsers)
      .get('/api/v1/users/:id', getUser)
      .post('/api/v1/users', addUser)
      .put('/api/v1/users/:id', updateUser)
      .delete('/api/v1/users/:id', deleteUser)

export default router;