'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';


export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        // Better Auth stores users in the "user" collection
        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function toggleWatchlistItem(symbol: string, company: string, pathname: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        const userId = session.user.id;
        await connectToDatabase();

        // เช็คว่ามีอยู่แล้วไหม
        const existing = await Watchlist.findOne({ userId, symbol });

        if (existing) {
            // ถ้ามี -> ลบออก
            await Watchlist.findByIdAndDelete(existing._id);
            revalidatePath(pathname); // รีเฟรชหน้าเว็บ
            return { action: 'removed', symbol };
        } else {
            // ถ้าไม่มี -> เพิ่มใหม่
            await Watchlist.create({
                userId,
                symbol,
                company
            });
            revalidatePath(pathname); // รีเฟรชหน้าเว็บ
            return { action: 'added', symbol };
        }

    } catch (error) {
        console.error('Error toggling watchlist:', error);
        throw error;
    }
}

export async function checkWatchlistStatus(symbol: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) return false; // ถ้าไม่ได้ Login ให้ถือว่าไม่มี

        await connectToDatabase();
        
        // เช็คใน DB ว่ามี user + symbol นี้จับคู่กันอยู่ไหม
        const exists = await Watchlist.exists({ 
            userId: session.user.id, 
            symbol: symbol.toUpperCase() 
        });

        return !!exists; // แปลงผลลัพธ์เป็น true/false
    } catch (error) {
        console.error('Check watchlist status failed:', error);
        return false;
    }
}