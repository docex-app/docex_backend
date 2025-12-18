import FlightTicket from "../model/flightTicketModel.js";

const getFlightTickets = async (req,res)=>{
    try{
        const allFlightTickets = await FlightTicket.find()

        if(!allFlightTickets || allFlightTickets.length===0){
            return res.status(404).json({
                success : false,
                message : "No Flight Tickets found !"
            })
        }

        res.status(200).json({
            success : true,
            flightTicket : allFlightTickets
        })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

//CREATE

const createFlightTicket = async (req,res)=>{
    try{
        const {paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber} = req.body;
         if (!paxName || !numOfPax || !farePerPax || !travelDate || !pnr || !sourceAirport || !destAirport || !flightNumber || !seatNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newFlightTicket = new FlightTicket({paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber})
        await newFlightTicket.save();


        res.status(201).json({
            success : true,
            message : "Flight Ticket Created Successfully",
            flightTicket : newFlightTicket
        })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }

}


//UPDATE

const updateFlightTicket = async (req,res)=>{
    try{
        const {id} = req.params;
        const {paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber} = req.body;
        const updatedFlightTicket = await FlightTicket.findByIdAndUpdate(id,{
            paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber
        }, {new:true})

        if(!updatedFlightTicket){
           return res.status(404).json({
                success : false,
                message : "Cannot find Flight Ticket"
            })
        }

          res.status(200).json({
            success : true,
            flightTicket : updatedFlightTicket
        })



    }catch(err){

        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

//DELETE
const deleteFlightTicket = async (req,res)=>{
    try{
        const {id} = req.params;
        const deletedFlightTicket = await FlightTicket.findByIdAndDelete(id);
        
        if(!deletedFlightTicket){
         return res.status(404).json({
            success : false,
            message : "Flight Ticket not found for deletion"
        })
    }

    res.status(200).json({
        success : true,
        message : "Flight Ticket has been deleted Successfully"
    })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

export {getFlightTickets,createFlightTicket,updateFlightTicket,deleteFlightTicket}