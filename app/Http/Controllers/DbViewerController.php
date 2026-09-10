<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DbViewerController extends Controller
{
    public function index(Request $request)
    {
        $connection = config('database.default');
        $tables = [];
        
        try {
            if ($connection === 'sqlite') {
                $tablesRaw = DB::select("SELECT name FROM sqlite_master WHERE type='table'");
                $tables = array_map(fn($t) => $t->name, $tablesRaw);
            } else {
                $tablesRaw = DB::select('SHOW TABLES');
                $tables = array_map(fn($t) => array_values((array)$t)[0], $tablesRaw);
            }
        } catch (\Exception $e) {
            // Ignore if connection fails
        }

        $results = null;
        $error = null;
        $sql = $request->input('sql', '');

        if ($request->isMethod('post') && $sql) {
            try {
                // Ensure only SELECT statements are run for safety
                if (stripos(trim($sql), 'select') !== 0 && stripos(trim($sql), 'show') !== 0 && stripos(trim($sql), 'pragma') !== 0) {
                    throw new \Exception("Hanya query SELECT/SHOW yang diizinkan untuk alasan keamanan.");
                }
                $results = DB::select($sql);
            } catch (\Exception $e) {
                $error = $e->getMessage();
            }
        }

        return Inertia::render('Admin/DbViewer', [
            'tables' => $tables,
            'initialResults' => $results,
            'initialError' => $error,
            'initialSql' => $sql
        ]);
    }
}
