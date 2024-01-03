import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProductRoutes } from '../modules/product/product.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
