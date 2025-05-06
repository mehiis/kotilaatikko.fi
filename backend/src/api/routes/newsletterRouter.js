import express from 'express';
import {adminCheck, authenticateToken} from '../../middlewares.js';
import {
  handleAddGuestSubscription,
  handleAddNewsletter,
  handleDeleteNewsletter,
  handleGetNewsletters,
  handleGetSubscribers,
  handleIsSubscribed,
  handleUserSubscription,
} from '../controllers/newsletterController.js';
import {uploadSingleImage} from '../../utils/fileUpload.js';

const newsletterRouter = express.Router();

newsletterRouter
  .route('/')
  .put(authenticateToken, handleUserSubscription) // Logged in user sub/unsub
  .post(handleAddGuestSubscription) // Guest sub
  .get(authenticateToken, adminCheck, handleGetNewsletters); // Get newsletters

newsletterRouter.route('/:email').get(handleIsSubscribed); // Check if guest user is subscribed

newsletterRouter
  .route('/modify')
  .post(
      (req, res, next) => {
      console.log('POST /modify route hit');
      next();
    },
    authenticateToken,
    adminCheck,
    uploadSingleImage('image'),
    handleAddNewsletter,
  ); // Add newsletter

newsletterRouter
  .route('/modify/:id')
  .delete(authenticateToken, adminCheck, handleDeleteNewsletter); // Delete newsletter

newsletterRouter
  .route('/subscribers')
  .get(authenticateToken, adminCheck, handleGetSubscribers); // Get all subscribers (users and guests)

export default newsletterRouter;
