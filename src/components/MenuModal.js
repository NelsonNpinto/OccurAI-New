import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const MenuModal = ({ visible, onClose, onNewChat, onPreviousChat }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuModal}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onNewChat}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>⊕</Text>
            <Text style={styles.menuText}>New Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onPreviousChat}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>↶</Text>
            <Text style={styles.menuText}>Previous Chat</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuModal: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    color: '#E4C67F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
});

export default MenuModal;