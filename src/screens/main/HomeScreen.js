import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../../app/actions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  // Helper function to display value or default
  const displayValue = (value, defaultValue = 'Not provided') => {
    return value && value.trim() !== '' ? value : defaultValue;
  };

  // Get initials for avatar
  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get full name or fallback
  const getFullName = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    if (lastName) {
      return lastName;
    }
    if (user?.username) {
      return user.username;
    }
    return 'User';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>{getInitials()}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusDot}>●</Text>
            </View>
          </View>
          
          <Text style={styles.profileName}>{getFullName()}</Text>
          <Text style={styles.profileUsername}>@{user?.username || 'username'}</Text>
        </View>

        {/* Profile Information Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
        </View>

        <View style={styles.infoCard}>
          {/* First Name */}
          <View style={styles.infoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.infoIcon}>👤</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>
                {displayValue(user?.firstName)}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          {/* Last Name */}
          <View style={styles.infoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.infoIcon}>👤</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>
                {displayValue(user?.lastName)}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          {/* Username */}
          <View style={styles.infoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.infoIcon}>📧</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>
                {displayValue(user?.username)}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          {/* Email (if available) */}
          {user?.email && (
            <>
              <View style={styles.infoRow}>
                <View style={[styles.infoIconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={styles.infoIcon}>✉️</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>
              <View style={styles.infoDivider} />
            </>
          )}

          {/* Roles */}
          <View style={styles.infoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.infoIcon}>🔑</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Roles</Text>
              <View style={styles.rolesContainer}>
                {user?.roles && user.roles.length > 0 ? (
                  Array.isArray(user.roles) ? (
                    user.roles.map((role, index) => (
                      <View key={index} style={styles.roleBadge}>
                        <Text style={styles.roleText}>
                          {role.replace('ROLE_', '')}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>
                        {user.roles.replace('ROLE_', '')}
                      </Text>
                    </View>
                  )
                ) : (
                  <Text style={styles.infoValue}>No roles assigned</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3BAD59',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3BAD59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    color: '#4CAF50',
    fontSize: 20,
    lineHeight: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 4,
  },
  roleText: {
    color: '#3BAD59',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#FFFFFF',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;