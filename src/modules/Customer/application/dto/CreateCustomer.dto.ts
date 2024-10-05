/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCustomerDTO:
 *       type: object
 *       required: [name, email, address]
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 */
export interface CreateCustomerDTO {
  id: string;
  name: string;
  email: string;
  address: string;
}
