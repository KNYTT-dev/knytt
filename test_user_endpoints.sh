#!/bin/bash

# Test User Endpoints Script
# This script tests all the newly created user endpoints

API_URL="http://localhost:8001"

echo "======================================"
echo "Testing User Endpoints"
echo "======================================"
echo ""

echo "1. Testing GET /users/me/favorites"
echo "--------------------------------------"
curl -s "$API_URL/users/me/favorites" | python3 -m json.tool | head -50
echo ""
echo ""

echo "2. Testing GET /users/me/stats"
echo "--------------------------------------"
curl -s "$API_URL/users/me/stats" | python3 -m json.tool
echo ""
echo ""

echo "3. Testing GET /users/me/history (limit=5)"
echo "--------------------------------------"
curl -s "$API_URL/users/me/history?limit=5" | python3 -m json.tool
echo ""
echo ""

echo "4. Testing GET /users/me/history?interaction_type=like"
echo "--------------------------------------"
curl -s "$API_URL/users/me/history?interaction_type=like&limit=5" | python3 -m json.tool
echo ""
echo ""

echo "======================================"
echo "Test Complete!"
echo "======================================"
echo ""
echo "Note: These endpoints require authentication."
echo "To test with authentication, visit: http://localhost:3000/test-user-endpoints"
echo "Make sure you're logged in first at: http://localhost:3000/login"
