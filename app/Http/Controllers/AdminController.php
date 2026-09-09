<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            $totalRegistrants = Participant::count();
            $totalHadir = Participant::where('status_hadir', true)->count();
            $totalPending = $totalRegistrants - $totalHadir;
            
            $recentParticipants = Participant::orderBy('created_at', 'desc')
                ->take(5)
                ->get(['id', 'full_name as nama_lengkap', 'institution as instansi', 'created_at as createdAt', 'status_hadir']);

            return Inertia::render('Admin/Dashboard', [
                'totalRegistrants' => $totalRegistrants,
                'totalHadir' => $totalHadir,
                'totalPending' => $totalPending,
                'recentParticipants' => $recentParticipants,
                'isDbError' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Admin Dashboard DB Error: ' . $e->getMessage());
            return Inertia::render('Admin/Dashboard', [
                'totalRegistrants' => 0,
                'totalHadir' => 0,
                'totalPending' => 0,
                'recentParticipants' => [],
                'isDbError' => true,
            ]);
        }
    }

    public function peserta()
    {
        try {
            $participants = Participant::orderBy('created_at', 'desc')->get();
            
            return Inertia::render('Admin/Peserta', [
                'participants' => $participants,
                'isDbError' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Admin Peserta DB Error: ' . $e->getMessage());
            return Inertia::render('Admin/Peserta', [
                'participants' => [],
                'isDbError' => true,
            ]);
        }
    public function toggle(Request $request, $id)
    {
        $participant = Participant::findOrFail($id);
        $participant->update([
            'status_hadir' => $request->status_hadir,
            'waktu_hadir' => $request->status_hadir ? now() : null,
        ]);
        
        return back()->with('success', 'Status kehadiran berhasil diubah.');
    }
}
