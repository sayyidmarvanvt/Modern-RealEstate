import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createResidency=asyncHandler(async(req,res)=>{
  const {title, description,price,address,country,city,facilities,image,userEmail}=req.body.data
  console.log(req.body.data);
})