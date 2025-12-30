// 数据库连接服务
import mysql from 'mysql2/promise';
import dbConfig from './dbConfig.js';

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 获取连接
export const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    return connection;
  } catch (error) {
    console.error('获取数据库连接失败:', error);
    throw error;
  }
};

// 执行SQL查询
export const executeQuery = async (sql, params = []) => {
  let connection = null;
  try {
    connection = await getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('执行SQL查询失败:', error);
    console.error('SQL:', sql);
    console.error('参数:', params);
    throw error;
  } finally {
    if (connection) {
      connection.release(); // 释放连接回连接池
    }
  }
};

// 执行事务
export const executeTransaction = async (callback) => {
  let connection = null;
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    
    const result = await callback(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('执行事务失败:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// 关闭连接池
export const closePool = async () => {
  try {
    await pool.end();
    console.log('数据库连接池已关闭');
  } catch (error) {
    console.error('关闭数据库连接池失败:', error);
    throw error;
  }
};

export default pool;