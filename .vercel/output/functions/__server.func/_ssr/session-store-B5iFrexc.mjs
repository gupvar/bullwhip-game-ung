import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as ROLES, s as TEAM_NAMES } from "./types-B71k4oFf.mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-store-B5iFrexc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Handle = string().trim().min(1, "Enter a first name or nickname.").max(16).regex(/^[A-Za-z0-9][A-Za-z0-9 .'-]{0,15}$/, "Use a short nickname, no email.");
var RoomCode = string().trim().toUpperCase().regex(/^[A-Z]{4}$/, "Room code is 4 letters.");
var Pin = string().trim().regex(/^\d{4}$/, "PIN is 4 digits.");
var RoleZ = _enum(ROLES);
var createSession = createServerFn({ method: "POST" }).validator((input) => object({ teamCount: number().int().min(1).max(TEAM_NAMES.length) }).parse(input)).handler(createSsrRpc("d48ff02bef0a6ae26e0632fc2c226987a42fd73c74a258fea7d3e823d622d104"));
var instructorLogin = createServerFn({ method: "POST" }).validator((input) => object({
	roomCode: RoomCode,
	pin: Pin
}).parse(input)).handler(createSsrRpc("f045535e2ee22e44cef2ec67cc2b156e4e856f0354f13c3d2156693434ee287d"));
var listOpenSeats = createServerFn({ method: "POST" }).validator((input) => object({ roomCode: RoomCode }).parse(input)).handler(createSsrRpc("3b9970c0c4f9d78caf6d6c0c7a8cb33221a989243035fc553a5c524a9d7165c6"));
var joinSeat = createServerFn({ method: "POST" }).validator((input) => object({
	roomCode: RoomCode,
	handle: Handle,
	teamIndex: number().int().min(0).max(TEAM_NAMES.length - 1),
	role: RoleZ
}).parse(input)).handler(createSsrRpc("43a8a3ab2dfbf8b9ef3816aa810595afac73269eef3f19b1ec6b901131cb3390"));
var getInstructorView = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(createSsrRpc("60e0d69039867e0c5dc1c51d0a486e70a52f4e6a1b871901b8a17aa6ea9084f6"));
var startGame = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(createSsrRpc("a3b039e599b68e411fdca1fbe510c16f43f3bd17b4bb8fb0d1eaf1f9852a03e3"));
var fillBotsNow = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(createSsrRpc("751d6ce02c762091be47e0d0ca7cf5683258d68593d8a0300a94dd2fc0b55816"));
var revealDemand = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(createSsrRpc("9f7abc1b36781dcac9aca68ed27fd5cebd0cf96c8268ec280ccf344851fef1a7"));
var instructorPlaceOrder = createServerFn({ method: "POST" }).validator((input) => object({
	token: string().min(8),
	teamIndex: number().int().min(0),
	role: RoleZ,
	quantity: number().int().min(0).max(30)
}).parse(input)).handler(createSsrRpc("6b4f62502706c6e47fbe3ce5dcb6f1f88d5702d013726cf3b9794aefda80179d"));
var getSeatView = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(createSsrRpc("f77f4df9fa2ca0ed068c15d35b0200048cc14bc3a98be853a60c4454f44144f9"));
var placeOrder = createServerFn({ method: "POST" }).validator((input) => object({
	token: string().min(8),
	quantity: number().int().min(0).max(30)
}).parse(input)).handler(createSsrRpc("1c74da3bbeee54cfce2bb1ead3cb3bf9027a033bc61c227f51bd203370a49868"));
var STUDENT_KEY = "nighthawk-student";
var INSTRUCTOR_KEY = "nighthawk-instructor";
function read(key) {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(value));
}
function getStudentSession() {
	return read(STUDENT_KEY);
}
function setStudentSession(session) {
	write(STUDENT_KEY, session);
}
function clearStudentSession() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(STUDENT_KEY);
}
function getInstructorSession() {
	return read(INSTRUCTOR_KEY);
}
function setInstructorSession(session) {
	write(INSTRUCTOR_KEY, session);
}
function clearInstructorSession() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(INSTRUCTOR_KEY);
}
//#endregion
export { startGame as _, getInstructorSession as a, getStudentSession as c, joinSeat as d, listOpenSeats as f, setStudentSession as g, setInstructorSession as h, fillBotsNow as i, instructorLogin as l, revealDemand as m, clearStudentSession as n, getInstructorView as o, placeOrder as p, createSession as r, getSeatView as s, clearInstructorSession as t, instructorPlaceOrder as u };
