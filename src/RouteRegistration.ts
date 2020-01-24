import { Router } from "express";

export interface RouteRegistration {
    routes: Router,
    free: string[]
}