import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server library
import prisma from "@/app/lib/db"; // Import the pool instance from the db.ts file

// GET request to fetch all todos
export async function GET() {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: { id: 'desc' }
        });
        return NextResponse.json(todos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }
}

// POST request to create a new todo
export async function POST(request: Request) {
    try {
        const { task } = await request.json();
        const newTodo = await prisma.todo.create({
            data: { task, completed: false }
        });
        return NextResponse.json(newTodo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }
}

// PUT request to update a todo
export async function PUT(request: Request) {
    try {
        const { id, completed } = await request.json();
        const updatedTodo = await prisma.todo.update({
            where: { id: Number(id) },
            data: { completed }
        });
        return NextResponse.json(updatedTodo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}

// DELETE request to delete a todo
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.todo.delete({
            where: { id: Number(id) }
        });
        return NextResponse.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}