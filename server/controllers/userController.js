import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");
  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered succefully",
      user: user,
    });
  } else res.status(201).json({ message: "User already registered" });
});

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    // Check if the user has already booked a visit with the given id
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residecncy is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("Your visit is booked successfully");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const allBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (error) {
    throw new Error(error.message);
  }
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.send("Booking cancelled Successfully");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export const favorite = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (user.favResidenciesID.includes(id)) {
        const updateUser = await prisma.user.update({
          where: { email },
          data: {
            favResidenciesID: {
              set: user.favResidenciesID.filter((id) => id !== id),
            },
          },
        });
  
        res.send({ message: "Removed from favorites", user: updateUser });
      } else {
        const updateUser = await prisma.user.update({
          where: { email },
          data: {
            favResidenciesID: {
              push: id,
            },
          },
        });
        res.send({ message: "Updated favorites", user: updateUser });
      }
    } catch (err) {
      throw new Error(err.message);
    }
});

export const allfavorite=asyncHandler(async(req,res)=>{
    const {email}=req.body
    try {
        const favorite=await prisma.user.findUnique({
            where:{email},
            select:{favResidenciesID:true}
        })
        res.status(200).send(favorite)
    } catch (error) {
        throw new Error(error.message)
    }
})