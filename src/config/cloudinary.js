// src/config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dniucj0iy',
  api_key: process.env.CLOUDINARY_API_KEY || '854391991949526',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rTIb0a6H428XIYRjXZrMhMTSXOE'
});

export default cloudinary;
