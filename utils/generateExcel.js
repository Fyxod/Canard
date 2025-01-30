import fs from 'fs';
import ExcelJS from 'exceljs';
import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import connectMongo from '../config/db.js';
import mongoose from 'mongoose';

async function generateExcel(data) {
    await connectMongo();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Teams Data');
    const teams = await Team.find().populate('members');

    // Define the columns
    worksheet.columns = [
        { header: 'Serial No', key: 'serialNo', width: 10 },
        { header: 'Team Name', key: 'teamName', width: 20 },
        { header: 'Users', key: 'users', width: 50 },
        { header: 'Phase Order', key: 'phaseOrder', width: 20 },
        { header: 'Phase 1 Task Order', key: 'phase1TaskOrder', width: 20 },
        { header: 'Phase 2 Task Order', key: 'phase2TaskOrder', width: 20 },
        { header: 'Phase 3 Task Order', key: 'phase3TaskOrder', width: 20 },
        { header: 'Powerups', key: 'powerups', width: 20 },
        { header: 'Credit Card No', key: 'creditCardNo', width: 30 }
    ];

    // Populate rows with serial numbers
    teams.forEach((team, index) => {
        worksheet.addRow({
            serialNo: index + 1, // Assigning serial numbers
            teamName: team.name,
            users: team.members.map(m => m.username).join(', '),
            phaseOrder: team.phaseOrder.join(', '),
            phase1TaskOrder: team.phase1?.taskOrder?.join(', ') || '',
            phase2TaskOrder: team.phase2?.taskOrder?.join(', ') || '',
            phase3TaskOrder: team.phase3?.taskOrder?.join(', ') || '',
            powerups: team.powerups.join(', '),
            creditCardNo: team.creditCardNo
        });
    });

    // Save the Excel file
    await workbook.xlsx.writeFile('teams_data.xlsx');
    console.log('Excel file created: teams_data.xlsx');
    mongoose.connection.close();
}

// Sample usage
const sampleData = [/* Your MongoDB data array here */];
generateExcel(sampleData);
