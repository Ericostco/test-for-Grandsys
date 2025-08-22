import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TodoApp from './App';

describe('TodoApp', () => {
  // 測試新增待辦事項
  test('應該能夠新增待辦事項', async () => {
    render(<TodoApp />);
    
    // 找到輸入框和新增按鈕
    const input = screen.getByPlaceholderText('新增待辦事項...');
    const submitButton = screen.getByText('新增');
    
    // 模擬使用者輸入和點擊新增
    await userEvent.type(input, '測試待辦事項');
    await userEvent.click(submitButton);
    
    // 驗證待辦事項已被新增到列表中
    const todoItem = screen.getByText('測試待辦事項');
    expect(todoItem).toBeInTheDocument();
    
    // 驗證輸入框已被清空
    expect(input).toHaveValue('');
  });

  // 測試切換待辦事項狀態
  test('應該能夠切換待辦事項的完成狀態', async () => {
    render(<TodoApp />);
    
    // 先新增一個待辦事項
    const input = screen.getByPlaceholderText('新增待辦事項...');
    const submitButton = screen.getByText('新增');
    await userEvent.type(input, '待測試項目');
    await userEvent.click(submitButton);
    
    // 找到待辦事項和其核取方塊
    const todoItem = screen.getByText('待測試項目').closest('li');
    const checkbox = within(todoItem!).getByRole('checkbox');
    
    // 點擊核取方塊切換狀態
    await userEvent.click(checkbox);
    expect(todoItem).toHaveClass('completed');
    
    // 再次點擊核取方塊
    await userEvent.click(checkbox);
    expect(todoItem).not.toHaveClass('completed');
  });

  // 測試刪除待辦事項
  test('應該能夠刪除待辦事項', async () => {
    render(<TodoApp />);
    
    // 新增待辦事項
    const input = screen.getByPlaceholderText('新增待辦事項...');
    const submitButton = screen.getByText('新增');
    await userEvent.type(input, '要刪除的項目');
    await userEvent.click(submitButton);
    
    // 找到刪除按鈕並點擊
    const deleteButton = screen.getByText('刪除');
    await userEvent.click(deleteButton);
    
    // 驗證項目已被刪除
    expect(screen.queryByText('要刪除的項目')).not.toBeInTheDocument();
  });

  // 測試編輯待辦事項
  test('應該能夠編輯待辦事項', async () => {
    render(<TodoApp />);
    
    // 新增待辦事項
    const input = screen.getByPlaceholderText('新增待辦事項...');
    const submitButton = screen.getByText('新增');
    await userEvent.type(input, '原始項目');
    await userEvent.click(submitButton);
    
    // 點擊編輯按鈕
    const editButton = screen.getByText('編輯');
    await userEvent.click(editButton);
    
    // 找到編輯輸入框並修改內容
    const editInput = screen.getByDisplayValue('原始項目');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, '已修改的項目');
    
    // 儲存修改
    const saveButton = screen.getByText('儲存');
    await userEvent.click(saveButton);
    
    // 驗證項目已被修改
    expect(screen.getByText('已修改的項目')).toBeInTheDocument();
    expect(screen.queryByText('原始項目')).not.toBeInTheDocument();
  });

  // 測試篩選功能
  test('應該能夠正確篩選待辦事項', async () => {
    render(<TodoApp />);
    
    // 新增兩個待辦事項
    const input = screen.getByPlaceholderText('新增待辦事項...');
    const submitButton = screen.getByText('新增');
    
    await userEvent.type(input, '項目1');
    await userEvent.click(submitButton);
    await userEvent.type(input, '項目2');
    await userEvent.click(submitButton);
    
    // 將第一個項目標記為完成
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(firstCheckbox);
    
    // 測試"已完成"篩選
    const completedFilter = screen.getByText('已完成');
    await userEvent.click(completedFilter);
    expect(screen.getByText('項目1')).toBeInTheDocument();
    expect(screen.queryByText('項目2')).not.toBeInTheDocument();
    
    // 測試"未完成"篩選
    const incompleteFilter = screen.getByText('未完成');
    await userEvent.click(incompleteFilter);
    expect(screen.queryByText('項目1')).not.toBeInTheDocument();
    expect(screen.getByText('項目2')).toBeInTheDocument();
    
    // 測試"全部"篩選
    const allFilter = screen.getByText('全部');
    await userEvent.click(allFilter);
    expect(screen.getByText('項目1')).toBeInTheDocument();
    expect(screen.getByText('項目2')).toBeInTheDocument();
  });

  // 測試 LocalStorage 持久化
  test('應該能夠從 LocalStorage 載入待辦事項', () => {
    // 模擬已存在的 LocalStorage 資料
    const mockTodos = [
      {
        id: 1,
        title: '已儲存的項目',
        isCompleted: false,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('todos', JSON.stringify(mockTodos));
    
    // 重新渲染元件
    render(<TodoApp />);
    
    // 驗證資料是否被載入
    expect(screen.getByText('已儲存的項目')).toBeInTheDocument();
    
    // 清理 LocalStorage
    localStorage.clear();
  });
});
