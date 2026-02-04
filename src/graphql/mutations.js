import { gql } from '@apollo/client';

// ============= BOOKING MUTATIONS =============
export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      room {
        id
        name
        images
      }
      startTime
      endTime
      purpose
      attendees
      status
      totalPrice
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: BookingUpdateInput!) {
    updateBooking(id: $id, input: $input) {
      id
      startTime
      endTime
      purpose
      attendees
      status
      totalPrice
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id) {
      success
      message
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;

// ============= ROOM MUTATIONS (ADMIN) =============
export const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
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
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: RoomUpdateInput!) {
    updateRoom(id: $id, input: $input) {
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
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deleteRoom(id: $id) {
      success
      message
    }
  }
`;

// ============= BOOKING MANAGEMENT (ADMIN) =============
export const APPROVE_BOOKING = gql`
  mutation ApproveBooking($id: ID!) {
    approveBooking(id: $id) {
      id
      status
    }
  }
`;

export const REJECT_BOOKING = gql`
  mutation RejectBooking($id: ID!, $reason: String) {
    rejectBooking(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

// ============= USER MANAGEMENT (ADMIN) =============
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;
