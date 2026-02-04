import { gql } from '@apollo/client';

// ============= ROOM QUERIES =============
export const GET_ROOMS = gql`
  query GetRooms($filter: RoomFilter, $limit: Int, $offset: Int) {
    rooms(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      description
      capacity
      facilities
      pricePerHour
      images
      status
      location
      floor
      createdAt
    }
  }
`;

export const GET_ROOM_BY_ID = gql`
  query GetRoomById($id: ID!) {
    room(id: $id) {
      id
      name
      description
      capacity
      facilities
      pricePerHour
      images
      status
      location
      floor
      createdAt
    }
  }
`;

// ============= BOOKING QUERIES =============
export const GET_MY_BOOKINGS = gql`
  query GetMyBookings($status: String) {
    myBookings(status: $status) {
      id
      room {
        id
        name
        images
        location
        floor
      }
      startTime
      endTime
      purpose
      attendees
      status
      totalPrice
      createdAt
    }
  }
`;

export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings($filter: BookingFilter) {
    bookings(filter: $filter) {
      id
      user {
        id
        name
        email
      }
      room {
        id
        name
        images
        location
      }
      startTime
      endTime
      purpose
      attendees
      status
      totalPrice
      createdAt
    }
  }
`;

export const GET_BOOKING_BY_ID = gql`
  query GetBookingById($id: ID!) {
    booking(id: $id) {
      id
      room {
        id
        name
        description
        images
        pricePerHour
        location
        floor
      }
      startTime
      endTime
      purpose
      attendees
      status
      totalPrice
      createdAt
    }
  }
`;

// ============= STATISTICS QUERIES =============
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalBookings
      activeBookings
      completedBookings
      pendingBookings
      cancelledBookings
    }
  }
`;

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalUsers
      totalRooms
      totalBookings
      totalRevenue
      pendingApprovals
      activeBookings
      availableRooms
      occupancyRate
    }
  }
`;

// ============= USER QUERIES =============
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      role
      avatar
      createdAt
    }
  }
`;
