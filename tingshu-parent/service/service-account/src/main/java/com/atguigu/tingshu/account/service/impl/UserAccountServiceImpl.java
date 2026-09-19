package com.atguigu.tingshu.account.service.impl;

import com.atguigu.tingshu.account.mapper.UserAccountDetailMapper;
import com.atguigu.tingshu.account.mapper.UserAccountMapper;
import com.atguigu.tingshu.account.service.UserAccountService;
import com.atguigu.tingshu.common.constant.SystemConstant;
import com.atguigu.tingshu.model.account.UserAccount;
import com.atguigu.tingshu.model.account.UserAccountDetail;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@SuppressWarnings({"all"})
public class UserAccountServiceImpl extends ServiceImpl<UserAccountMapper, UserAccount> implements UserAccountService {

	@Autowired
	private UserAccountMapper userAccountMapper;

	@Autowired
	private UserAccountDetailMapper userAccountDetailMapper;

	@Override
	public void initUserAccount(Map<String, Object> map) {
		Long userId = (Long)map.get("userId");
		BigDecimal amount =(BigDecimal) map.get("amount");
		String title = (String) map.get("title");
		String orderNo = (String) map.get("orderNo");
		//1.新增账户记录
		UserAccount userAccount = new UserAccount();
		userAccount.setUserId(userId);
		userAccount.setTotalAmount(amount);
		userAccount.setLockAmount(BigDecimal.valueOf(0.00));
		userAccount.setAvailableAmount(amount);
		userAccount.setTotalIncomeAmount(amount);
		userAccount.setTotalPayAmount(BigDecimal.valueOf(0.00));
		int insert = userAccountMapper.insert(userAccount);
		//2.新增账户变动日志
		if(insert > 0){
			UserAccountDetail userAccountDetail = new UserAccountDetail();
			userAccountDetail.setUserId(userId);
			//1201-充值
			userAccountDetail.setTradeType(SystemConstant.ACCOUNT_TRADE_TYPE_DEPOSIT);
			userAccountDetail.setAmount(amount);
			userAccountDetail.setTitle(title);
			userAccountDetail.setOrderNo(orderNo);
			userAccountDetailMapper.insert(userAccountDetail);
		}
	}

	@Override
	public BigDecimal getAvailableAmount(Long userId) {
		UserAccount userAccount = userAccountMapper.selectOne(
				new LambdaQueryWrapper<UserAccount>()
						.eq(UserAccount::getUserId, userId)
		);
		Assert.notNull(userAccount, "用户账户不存在");
		return userAccount.getAvailableAmount();
	}
}
